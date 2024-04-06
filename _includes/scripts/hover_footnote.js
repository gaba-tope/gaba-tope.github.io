  $(document).ready(function() {
    $('.footnote-ref').hover(
      function() {
        var footnoteId = $(this).text();
        $('#footnote' + footnoteId).css('display', 'block');
      },
      function() {
        var footnoteId = $(this).text();
        $('#footnote' + footnoteId).css('display', 'none');
      }
    );
  });
