$(document).ready(function () {
    init();
});

function init(){
    enable();
}

function enable () {
  $('.addNum').on('click', addNumFields);
  $('.removeNum').on('click', remNumFields);
  $('.clrForm').on('click', clrForm);
  deleteUser();
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
