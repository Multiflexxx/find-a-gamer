Feature('login');

Scenario('test something', (I) => {
    I.amOnPage('/');
    I.fillField('Email', 'test');
    I.fillField('Password', 'a');
    I.checkOption('mat-checkbox');
    I.click('Log In');
    pause();
});
