var page;

module.exports = {
  // '@disabled': true,
  'Tools menu: fake login screen': function (browser) {
    page = browser.page.lunchBadger();
    const username = 'John Doe';
    const invalidLogin = {
      '.FakeLogin .EntityProperty__error': 'Login or password is incorrect'
    };
    const usernameText = {
      '.breadcrumbs .breadcrumbs__element.username': username
    }
    page
      .openWithoutLogin()
      .setValueSlow('.input__login input', 'dump')
      .setValueSlow('.input__password input', username)
      .submitForm('.FakeLogin__form form')
      .check({text: invalidLogin})
      .setValueSlow('.input__login input', 'test')
      .submitForm('.FakeLogin__form form')
      .projectLoaded()
      .check({text: usernameText})
      .close();
  }
};
