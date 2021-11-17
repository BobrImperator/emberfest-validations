import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import { hbs } from 'ember-cli-htmlbars';
import { click, fillIn } from '@ember/test-helpers';

module('Integration | Component | UserForm', function (hooks) {
  setupRenderingTest(hooks);

  test("it doesn't show user name is required", async function (assert) {
    await render(hbs`<UserForm />`);

    await fillIn('[data-test-user-name-input]', 'some user name');
    await click('[data-test-user-submit]');

    assert.dom('[data-test-user-name-error]').doesNotExist();
  });

  test('it shows user name is required', async function (assert) {
    await render(hbs`<UserForm />`);

    await click('[data-test-user-submit]');

    assert.dom('[data-test-user-name-error]').hasText('field.required');
  });

  test("it doesn't show pet name is required", async function (assert) {
    await render(hbs`<UserForm />`);

    await click('[data-test-pet-add]');
    await fillIn(
      '[data-test-pet="0"] [data-test-pet-name-input]',
      'some pet name'
    );
    await click('[data-test-user-submit]');

    assert.dom('[data-test-pet="0"] [data-test-pet-name-error]').doesNotExist();
  });

  test('it shows pet name is required', async function (assert) {
    await render(hbs`<UserForm />`);

    await click('[data-test-pet-add]');
    await click('[data-test-user-submit]');

    assert
      .dom('[data-test-pet="0"] [data-test-pet-name-error]')
      .hasText('field.required');
  });

  test("it doesn't show pet name is required when user is allergic", async function (assert) {
    await render(hbs`<UserForm />`);

    await click('[data-test-pet-add]');
    await click('[data-test-user-is-allergic-input]');
    await click('[data-test-user-submit]');

    assert.dom('[data-test-pet="0"] [data-test-pet-name-error]').doesNotExist();
  });

  test('it shows pet name is required when user is not allergic', async function (assert) {
    await render(hbs`<UserForm />`);

    await click('[data-test-pet-add]');
    await click('[data-test-user-submit]');

    assert
      .dom('[data-test-pet="0"] [data-test-pet-name-error]')
      .hasText('field.required');
  });
});
