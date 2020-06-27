import api from './util/api.js';
import * as templates from './util/templates.js';
import { MESSAGE } from './util/constants.js';
export default class TodoCount {
  constructor({
    username,
    $targetTodoCountContainer,
    onRemoveAll,
  }) {
    this.username = username;
    this.$targetTodoCountContainer = $targetTodoCountContainer;

    this.$targetTodoCountContainer.addEventListener('click', (e) => {
      const { className } = e.target;
      if (className === 'clear-all') {
        const confirmRemoveAll = confirm(MESSAGE.CONFIRM);
        confirmRemoveAll && onRemoveAll();
      }
    });

    this.render();
  }
  setState(selectedUsername) {
    this.username = selectedUsername;
    this.render();
  }
  async render() {
    if (this.username) {
      const response = await api.fetchUserTodo(this.username);
      const data = response.todoList;
      const completedData =
        data && data.filter((todo) => todo.isCompleted === true);
      this.$targetTodoCountContainer.innerHTML = templates.TODOCOUNT(
        data,
        completedData,
      );
    }
  }
}
