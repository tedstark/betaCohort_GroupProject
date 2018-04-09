$(document).ready(function () {
    init();
});

function init(){
    enable();
}

function enable () {
  $('.addNum').on('click', addNumFields);
  $('.removeNum').on('click', remNumFields);
  // chgNumFields();
}

function addNumFields () {
  $('.multiFieldWrapper').each(function() {
      $('.multiField:first-child .removeNum', $('.multiFields', this)).attr('hidden',false)
      $('.multiField:first-child', $('.multiFields', this)).clone(true).appendTo($('.multiFields', this)).find('input').val('').focus();
      $('.multiField:first-child .removeNum', $('.multiFields', this)).attr('hidden',true)
  });
}
function remNumFields () {
  $(this).parent('.multiField').remove();
}
