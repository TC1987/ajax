var $orders = $('#orders'),
    $name = $('#name'),
    $drink = $('#drink');

var orderTemplate = '<li>Name: {{ name }}</li><li>Drink: {{ drink }}</li>'

function addOrder(order) {
    $orders.append(mustache.render(orderTemplate, order));
}

$.ajax({
    type: 'GET',
    url: '/orders',
    success: function(orders) {
        orders.forEach(function(order) {
            $orders.append('<li>Name: ' + order.name + '</li>' + '<li>Drink: ' + order.drink + '</li>');
        });
    },
    error: function() {
        alert('There was an error getting the orders.');
    }
});

$('#add-order').on('click', function() {
    var order = {
        name: $name.val(),
        drink: $drink.val()
    };

    $.ajax({
        type: 'POST',
        url: '/orders',
        data: order,
        // The type of data coming back from the server. If not included, the app guesses what it is.
        dataType: 'json',
        complete: function() {
            console.log('I run after everything is done, even if there\'s an error. Awesome opportunity to reset form fields.');
            $name.val('');
            $drink.val('');
        },
        success: function(data) {
            console.log(data);
            $orders.append('<li>Name: ' + order.name + '</li>' + '<li>Drink: ' + order.drink + '</li>');
        },
        error: function() {
            console.log('Error saving order.');
        }
    })

})
