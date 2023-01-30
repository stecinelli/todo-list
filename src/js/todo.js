const getState = () => {
  let newState = window.history.state;

  if (!newState) {
    newState = {
      list: [
      ],
    };
  }
  return newState;
};

const render = (htmlString, el) => {
  el.innerHTML = htmlString;
};

const updateState = newState => {
  window.history.pushState({ list: newState }, '');
  window.dispatchEvent(new Event('statechange'));
};

const createToDo = () => {
  const newToDoValue = document.getElementById('txtTodoItemTitle').value;

  const newToDo = {
    toDo: newToDoValue,
    id: (new Date()).getTime(),
    status: 'to-do',
  };

  const newToDoList = [...getState().list, newToDo];

  updateState(newToDoList);
};

const removeToDo = id => {
  const filteredList = getState().list.filter(td => td.id !== id);

  updateState(filteredList);
};

const moveToDone = id => {
  const { list } = getState();
  list.find(td => td.id === id).status = 'done';

  updateState(list);
};

const moveToToDo = id => {
  const { list } = getState();
  list.find(td => td.id === id).status = 'to-do';

  updateState(list);
};

const inputToDoItems = () => {
  const { list } = getState();
  const toDoList = list
    .sort((a, b) => a.id - b.id)
    .filter(item => item.status === 'to-do')
    .map(item => `<li class="todo__item" onclick="moveToDone(${item.id})">
            <input type="checkbox" name="unchecked" data-testid="todoItem" onclick="moveToDone(${item.id})">
            ${item.toDo}
            </li>`)
    .join('');
  return toDoList;
};

const inputDoneItems = () => {
  const { list } = getState();
  const doneList = list
    .sort((a, b) => a.id - b.id)
    .filter(item => item.status === 'done')
    .map(item => `<li class="todo__item--completed">
            <input type="checkbox" name="checked" data-testid="todoItem" onclick="moveToToDo(${item.id})" checked>
            ${item.toDo}
            <button class="todo__item--completed--deletebutton" data-testid="btnDeleteTodo" onclick="removeToDo(${item.id})"><img src="https://d29fhpw069ctt2.cloudfront.net/icon/image/49701/preview.svg" alt="delete"></button>
            </li>`)
    .join('');
  return doneList;
};

// CRIA HTML COMO STRING
const template = () => `<header>
<h1>To-do List</h1>
</header>

<main>

<div class="addtodo__box">
    <form class="addtodo__box--form" action="javascript:void(0);" >
        <input type="text" name="Add-To-do" placeholder="Add new To-do" class="addtodo__box--forminput" id="txtTodoItemTitle" data-testid="txtTodoItemTitle">
        <button class="addtodo__box--button" onclick="createToDo()" data-testid="btnAddTodo">+</button>
    </form>
</div>

<div class="todo__box">
    <h3>To-do</h3>
    <br/>
    <ul data-testid="todoList">
    ${inputToDoItems()}
    </ul>
</div>

<div class="done__box">
    <h3>Done</h3>
    <br/>
    <ul data-testid="todoList">
    ${inputDoneItems()}
    </ul>
</div>

</main>

`;

window.addEventListener('statechange', () => {
  render(template(), document.querySelector('#app'));
});

render(template(), document.querySelector('#app'));
