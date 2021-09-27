import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class UserFormComponent extends Component {
  @service store;

  user = this.store.createRecord('user');

  @action
  async onSubmit(event) {
    event.preventDefault();

    if (await this.user.validations.validate()) {
      this.user.save();
    }
  }

  @action
  addPet() {
    this.user.pets.createRecord();
  }

  @action
  removePet(pet) {
    pet.destroyRecord();
  }

  @action
  setIsAllergic(key, event) {
    this.user[key] = event.target.checked;
  }

  @action
  setUserField(key, event) {
    this._setField(this.user, key, event);
  }

  @action
  setPetField(pet, key, event) {
    this._setField(pet, key, event);
  }

  _setField(model, key, event) {
    model[key] = event.target.value;
  }
}
