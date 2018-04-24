$(document).ready(function () {
    init();
});

function init(){
    enable();
}

function enable () {
  $('.clrForm').on('click', clrForm);
  deleteUser();
  deleteGroup();
  deleteReminder();
  histTable();
  deleteMessage();
  // $('.addNum').on('click', addNumFields);
  // $('.removeNum').on('click', remNumFields);
}

// Reset Form Button
function clrForm() {
    document.getElementById("txtForm").reset();
}

// Delete User Button
function deleteUser () {
    $('.delete-user').on('click', function (user) {
          console.log('Click!');
          $target = $(user.target);
          var id = $target.attr('data-id');
          $.ajax({
              type:'DELETE',
              url: '/users/delete/'+id,
              success: function (response) {
                location.reload(true);
                req.flash('success', 'User deleted!');
              },
              error: function (err) {
                  console.log(err);
              }
          });
      });
}

function deleteGroup () {
    $('.delete-group').on('click', function (groupdd) {
          $target = $(groupdd.target);
          var id = $target.attr('data-id');
          $.ajax({
              type:'DELETE',
              url: '/groupdd/delete/'+id,
              success: function (response) {
                location.reload(true);
                req.flash('success', 'Group deleted!');
              },
              error: function (err) {
                  console.log(err);
              }
          });
      });
}

function deleteReminder () {
    $('.delete-reminder').on('click', function (reminderdd) {
          $target = $(reminderdd.target);
          var id = $target.attr('data-id');
          $.ajax({
              type:'DELETE',
              url: '/reminderdd/delete/'+id,
              success: function (response) {
                location.reload(true);
                req.flash('success', 'Reminder deleted!');
              },
              error: function (err) {
                  console.log(err);
              }
          });
      });
}

function deleteMessage () {
    $('.delete-msg').on('click', function (response) {
          $target = $(response.target);
          var sid = $target.attr('data-sid');

          $.ajax({
              type:'DELETE',
              url: '/twilio/delete/'+sid,
              success: function (response) {
                location.reload(true);
                req.flash('success', 'Message deleted!');
              },
              error: function (err) {
                  console.log(err);
              }
          });
          console.log('hello');
      });
}

function histTable() {
$('#histlog').DataTable({
  "order": [[ 0, "desc" ]]
});
}

// -------------UNUSED FUNCTIONS--------------------- //
// Counts number of character in text message preview
function textareaCount () {
    let text_max = 122;
    $('.previewMsg_Count').html(text_max + ' characters remaining');
    $('.previewMsg').keyup(function () {
        let text_length = $('.previewMsg').val().length;
        let text_remaining = text_max - text_length;
        $('.previewMsg_Count').html(text_remaining + ' characters remaining');
    });
}

// Adds additional 'To #' Field on Messages page
function addNumFields () {
    $('.multiFieldWrapper').each(function() {
      $('.multiField:first-child .removeNum', $('.multiFields', this)).attr('hidden',false)
      $('.multiField:first-child', $('.multiFields', this)).clone(true).appendTo($('.multiFields', this)).find('input').val('').focus();
      $('.multiField:first-child .removeNum', $('.multiFields', this)).attr('hidden',true)
    });
}

// Removes additional 'To #' Fields added to Messages Page
function remNumFields () {
    $(this).parent('.multiField').remove();
}
