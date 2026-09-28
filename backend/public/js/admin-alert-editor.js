tinymce.init({
  selector: '#body_html',
  license_key: 'gpl',
  menubar: false,
  plugins: 'link lists',
  toolbar: 'undo redo | bold italic | bullist numlist | link | announcementToken',
  setup: function (editor) {
    editor.ui.registry.addButton('announcementToken', {
      text: '{{announcement}}',
      onAction: function () {
        editor.insertContent('{{announcement}}');
      }
    });
  }
});
