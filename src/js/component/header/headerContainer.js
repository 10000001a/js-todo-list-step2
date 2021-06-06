import { $ } from "../../util/querySelector.js";
import UserList from "./userList.js";

export default class HeaderContainer {
  constructor({ addUser }) {
    this.onChangeUserList = addUser;

    this.userList = new UserList({
      addUser: this.onChangeUserList,
      deleteUser: () => {},
      changeCurrentUser: () => {},
    });

    this.$title = $("#user-title");
  }

  render = (userList, selectedUserInfo) => {
    this.userList.render(userList, selectedUserInfo);
    this.$title.dataset.username = selectedUserInfo.name;
    this.$title.innerHTML = `<span><strong>${selectedUserInfo.name}</strong>'s Todo List</span>`;
  };
}
