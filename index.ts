import { reactive } from "./reactive";
import { effect } from "./effect";

// const userWithoutProxy = {
//   name: "John",
//   role: "admin",
//   age: 36,
// };

// const user = reactive(userWithoutProxy);

// effect(() => {
//   const userName = user.name;
//   console.log("---- userName ---", userName);
// });

// user.name = "UserName@" + Math.random().toString().slice(2);
// user.role = "role@" + Math.random().toString().slice(2);

// /**
//  * 自定义 scheduler
//  */
// const schedulerUser = { name: "Foo", role: "user", age: 26 };
// const user2 = reactive(schedulerUser);

// const _runner = effect(
//   () => {
//     console.log("更新咯", user2.name);
//   },
//   {
//     scheduler: () => {
//       console.log("调度更新:", user2.name);
//     },
//   }
// );

// user2.name = "100";
// _runner();

const pagination = reactive({ currentPage: 1 });

effect(() => {
  updatePageUI(`${pagination.currentPage} is loading...`);
  fetch("https://jsonplaceholder.typicode.com/todos/" + pagination.currentPage)
    .then((response) => response.json())
    .then(updatePageUI)
    .catch(() => updatePageUI(`${pagination.currentPage} load failed`));
});

function updatePageUI(detailTodo) {
  const container = document.querySelector(".todo-detail-container")!;
  container.innerHTML = JSON.stringify(detailTodo, null, 2);
}

window.onload = () => {
  document.querySelector(".prev-btn")!.addEventListener("click", () => {
    pagination.currentPage--;
  });
  document.querySelector(".next-btn")!.addEventListener("click", () => {
    pagination.currentPage++;
  });
};
