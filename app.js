$(document).ready(function(){

  $calendar = $('#calendar');

  //Generates Calendar Via Jquery UI
  $calendar.datepicker({
    onSelect: function (dateText,inst) {
      inst.show()
    }
  });

  //Inject Needed HTML
  function calendarElements() {
    $calendar
      .find('.ui-state-default')
      .addClass('date')
      .wrap('<div class="dayWrap"><div class="day"></div></div>');
    $calendar.find('.dayWrap').append('<div class="items"></div>');
    $calendar.on('click',function(e){
      e.preventDefault();
    });
  }

  function allCalculations() {

    ///////////////////////////////////////////////////////////////////////////////////
    // Account Information
    ///////////////////////////////////////////////////////////////////////////////////

    //Account Names
    var aA = 'Bank';
    var aB = 'Credit';

    //Starting Amounts
    var aAstarting = 1519.72;
    var aBstarting = 851.35;

    //Adds In Total Place Holders
    $('.dayWrap').find('.day')
      .prepend('<span class="aAtotal">$<span class="aAtotalPrice"></span></span>')
      .prepend('<span class="aBtotal">$<span class="aBtotalPrice"></span></span>');

    //Add Name of Account
    $('.aAtotal').append('<span class="aAname">'+aA+'</span>');
    $('.aBtotal').append('<span class="aBname">'+aB+'</span>');
    $('.items i.aAcharge').prepend('<span class="aAname">- '+aA+'</span>');
    $('.items i.aAcredit').prepend('<span class="aAname">+ '+aA+'</span>');
    $('.items i.aBcharge').prepend('<span class="aBname">- '+aB+'</span>');
    $('.items i.aBcredit').prepend('<span class="aBname">+ '+aB+'</span>');

    ///////////////////////////////////////////////////////////////////////////////////
    // Price Calculations
    ///////////////////////////////////////////////////////////////////////////////////

    //Calculate Function
    function doCalculations(){
      var aAtotal = aAstarting;
      var aBtotal = aBstarting;
      $('.dayWrap').each(function(){
        $day = $(this);
        $day.find('i').each(function(){
          $entry = $(this);
          var spPrice = parseFloat($entry.find('.price').text());
          if ($entry.hasClass('aAcharge')){aAtotal -= spPrice}
          if ($entry.hasClass('aAcredit')){aAtotal += spPrice}
          if ($entry.hasClass('transfer')){aAtotal -= spPrice}
          if ($entry.hasClass('aBcharge')){aBtotal -= spPrice}
          if ($entry.hasClass('aBcredit')){aBtotal += spPrice}
          if ($entry.hasClass('aBtransf')){aAtotal -= spPrice}
        });
        $day.find('.aAtotal .aAtotalPrice').html(aAtotal.toFixed(2));
        $day.find('.aBtotal .aBtotalPrice').html(aBtotal.toFixed(2));
      });
    }

    //Initilize First Calculations
    doCalculations();

    ///////////////////////////////////////////////////////////////////////////////////
    // Actions
    ///////////////////////////////////////////////////////////////////////////////////

    //Tapping The Day Toggles It's Item List
    $(".day").on("tap",function(){
      var hasItems = $(this).parent().find('.items');
      if (hasItems) {
        $(this).toggleClass('selected');
        $(this).next().slideToggle(0);
      }
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // Add Edit And Delete
    ///////////////////////////////////////////////////////////////////////////////////

    //Add The Add Option To Items
    $('.day').parent().prepend('<a href="javascript:;" class="add">Add Item</a>');

    //Add Delete Option To Items
    $('.items i').append('<a href="javascript:;" class="delete">delete</a>');

    //Add Item
    $('.add').click(function(){
      $(this).parent().find('.items').append('<i class="aBCharge food">Food <span class="priceWrap">$<span class="price">20</span></span></i>');
      doCalculations();
    });

    //Delete Item
    $('.container').on('click','.delete',function(){
      var itemClass = $(this).parent().attr('class').split(' ')[1];
      $(this).parent().parent().parent().find('.day span.'+itemClass+':first').remove();
      $(this).parent().remove();
      doCalculations();
    });

    //Add Bar Graph Per Item Per Day And Category Names
    $('.dayWrap .items i').each(function(){
      $entry = $(this);
      if ($entry.is('.aAcharge, .aAcredit, .aBcharge, .aBcredit')) {
        var className = $entry.attr('class');
        var classNames = className.split(' ')[1];
        $entry.parent().parent().find('.day').append('<u class="'+className+'"></u>');
        $entry.append('<span class="category">'+classNames+'</span>');
      }
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // Helper Classes
    ///////////////////////////////////////////////////////////////////////////////////

    //Adds Pay Green Color To Line Item To Indicate Income
    $('.income').parent().parent().addClass('pay');

    //If Price Has No Decimal Amount It Adds .00
    $('.price').each(function(){
      var decimal = $(this).text();
      if (decimal.indexOf('.') == -1) {
        $(this).append('.00');
      }
    });

    //Adds Cents Wrapper To All Prices
    $('.aAtotalPrice, .aBtotalPrice, .price').each(function(){
      var price = $(this).text();
      var dollars = price.slice(0,-3);
      var cents = price.slice(-2);
      $(this).html(dollars+'<span class="cents">.'+cents+'</span>');
    });

    ///////////////////////////////////////////////////////////////////////////////////
    // Mobile Gestures
    ///////////////////////////////////////////////////////////////////////////////////

    //Hides Jquery Mobile Loading Message
    $.mobile.loading().hide();

    //Swipe to Show/Hide Add Item
    $(".day").on("swipeleft",function(){
      $(this).find('.date').animate({'margin-left':'-130px'},200).addClass('pulled');
      $(this).parent().find('.add').animate({'right':'0','opacity':'1'},200);
    });
    $(".day").on("swiperight",function(){
      $(this).find('.date').animate({'margin-left':'0'},200).removeClass('pulled');
      $(this).parent().find('.add').animate({'right':'-130px','opacity':'0'},200);
    });

    //Swipe To Show/Hide Delete Item
    $(".items i").on("swipeleft",function(){
      $(this).find('.delete').animate({'right':'0','opacity':'1'},200);
    });
    $(".items i").on("swiperight",function(){
      $(this).find('.delete').animate({'right':'-100px','opacity':'0'},200);
    });

  }

  //Initilizes Calendar Element Injection and Calculations
  calendarElements();
  allCalculations();

  //Clicking For Next Calendar Month
  $calendar.on('click',function(){
    var cElements = $('.dayWrap');
    if (cElements.length === 0) {
      calendarElements();
      allCalculations();
    }
  });

});