import { reactive } from "./reactive";
import { effect } from "./effect";

const userWithoutProxy = {
  name: "John",
  role: "admin",
  age: 36,
};

const user = reactive(userWithoutProxy);

effect(() => {
  const userName = user.name;
  const role = user.role;
  console.log("---- userName ---", userName);
});

user.name = "UserName@" + Math.random().toString().slice(2);
user.role = "role@" + Math.random().toString().slice(2);

/**
 * 自定义 scheduler
 */
const schedulerUser = { name: "Foo", role: "user", age: 26 };
const user2 = reactive(schedulerUser);

const _runner = effect(
  () => {
    console.log("更新咯", user2.name);
  },
  {
    scheduler: () => {
      console.log("调度更新:", user2.name);
    },
  }
);

user2.name = "100";
_runner();