export default function showToast(text) {
  $('.toast').text(text || '')
  $('.toast').addClass('show')
  setTimeout(() => {
    $('.toast').removeClass('show')
  }, 1500);
}