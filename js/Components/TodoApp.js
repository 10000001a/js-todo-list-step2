import TodoInput from "./TodoInput.js";
import TodoList from "./TodoList.js";
import API from "../api.js";

function TodoApp($target, activeUser) {
  this.$target = $target;
  this.state = {
    activeUser,
    todoItems: [],
  };

  this.render = () => {
    this.$target.innerHTML = `
        <section id="todo-input" class="input-container"></section>
        <section class="main">
        <ul id="todo-list" class="todo-list"></ul>
        </section>
        <div id="todo-count" class="count-container"></div>
    `;
  };

  this.initComponents = async () => {
    this.state.todoItems = await API.fetchTodoItemsFromAPI(
      this.state.activeUser
    );
    this.todoInput = new TodoInput({
      $target: document.querySelector("#todo-input"),
      addTodo: this.addTodo.bind(this),
    });
    this.todoList = new TodoList(
      document.querySelector("#todo-list"),
      this.state.todoItems,
      {
        deleteTodo: this.deleteTodo.bind(this),
        toggleTodo: this.toggleTodo.bind(this),
        editTodoContents: this.editTodoContents.bind(this),
        setPriority: this.setPriority.bind(this),
      }
    );
  };

  this.addTodo = async (textContents) => {
    const todo = await API.addTodoFromAPI(this.state.activeUser, textContents);
    this.state.todoItems = [...this.state.todoItems, todo];
    this.setState();
  };

  this.deleteTodo = async (_id) => {
    const { todoList } = await API.deleteTodoFromAPI(
      this.state.activeUser,
      _id
    );
    this.state.todoItems = todoList;
    this.setState();
  };

  this.toggleTodo = async (_id) => {
    const todoItem = this.state.todoItems.find(
      (todoItem) => todoItem._id === _id
    );
    if (!todoItem) {
      console.log(`Can not find todoItem with Id ${_id}`);
      return;
    }
    const todo = await API.toggleTodoFromAPI(this.state.activeUser, _id);
    todoItem.isCompleted = todo.isCompleted;
    this.setState();
  };

  this.editTodoContents = async (_id, contents) => {
    const todoItem = this.state.todoItems.find(
      (todoItem) => todoItem._id === _id
    );
    if (!todoItem) {
      console.log(`Can not find todoItem with Id ${_id}`);
      return;
    }
    const res = await API.editTodoContentsFromAPI(
      this.state.activeUser,
      _id,
      contents
    );
    todoItem.contents = res.contents;
    this.setState();
  };

  this.setPriority = async (_id, priority) => {
    await API.setPriorityFromAPI(this.state.activeUser, _id, priority);
    // 여기서부터 심화 구현 작업 진행 필요
  }

  this.fetchTodoList = async () => {
    this.state.todoItems = await API.fetchTodoItemsFromAPI(
      this.state.activeUser
    );
    this.todoList.setState(this.state.todoItems);
  }

  this.setState = (state) => {
    if(state && state.activeUser) {
      this.state.activeUser = state.activeUser;
    }
    if(state && state.todoItems) {
      this.state.todoItems = state.todoItems;
    }
    this.todoList.setState(this.state.todoItems);
  };

  this.render();
  this.initComponents();
}

export default TodoApp;
