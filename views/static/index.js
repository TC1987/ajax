// .on() is OP!! You're able to delegate events to a parent object that listens for an event on behalf of its children. When an event occurs,
// you can check if the event is a result of something happening (e.g click) to a specific child (which is the 2nd argument in the .on method).
// $('PARENT').on('EVENT', 'CHILD', function() {

// })

// Traversing the DOM is expensive so get node and store it in a variable for quick/easy reference.
var $orders = $('#orders'),
    $name = $('#name'),
    $drink = $('#drink');

// Get everything within the element that has the id '#order-template'.
var orderTemplate = $('#order-template').html();

// Add order to homepage. Notice that nothing is being returned because we're just appending.
function addOrder(order) {
    $orders.append(Mustache.render(orderTemplate, order));
}

// AJAX used to get all orders.
$.ajax({
    type: 'GET',
    url: '/orders',
    success: function(orders) {
        orders.forEach(function(order) {
            addOrder(order);
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
            addOrder(data);
        },
        error: function() {
            console.log('Error saving order.');
        }
    });
});

// Delegating click events to the parent element that has the id '#orders'. Every time event occurs, function checks to see
// if event is propagating/bubbling from the element with class '.remove'.
$('#orders').on('click', '.remove', function() {
    var self = $(this).closest('li'),
        $id = self.attr('data-id');

    $.ajax({
        type: 'DELETE',
        url: '/orders/' + $id,
        success: function(orders) {
            self.fadeOut(300, function() {
                self.remove();
            });
        }
    });
});

$('#orders').on('click', '.editOrder, .cancelEdit, .saveEdit', function(event) {
    var $li = $(this).closest('li');

    $li.find('.noEdit').toggle();
    $li.find('.onEdit').toggle();

    if (event.target.innerHTML === 'Edit') {
        $li.find('.name').val( $li.find('#name').html() );
        $li.find('.drink').val( $li.find('#drink').html() );
    }
})

$('#orders').on('click', '.saveEdit', function() {
    // Better to not add ID property to editedOrder. App would be vulnerable to malicious edits.
    var self = $(this).closest('li'),
        editedOrder = {
            name: self.find('.name').val(),
            drink: self.find('.drink').val()
        };

    $.ajax({
        type: 'PUT',
        url: '/orders/' + self.attr('data-id'),
        data: editedOrder,
        success: function(data) {
            // Option #1: Rerender everything.
            // Option #2: Target specific order and update values.
            // Option #3: Delete the li and append a new one. Would put it at the bottom of the list though.
            var $li = self.parent().find('[data-id="' + data.id + '"]');
            $li.find('#name').html(data.name);
            $li.find('#drink').html(data.drink);
        }
    })
})
