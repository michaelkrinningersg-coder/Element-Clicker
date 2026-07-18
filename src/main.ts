import "./app.css";
import { mount } from "svelte";
import App from "./App.svelte";
import { startLoop } from "./lib/game/loop";

const app = mount(App, { target: document.getElementById("app")! });

startLoop();

export default app;
