import { createMachine, interpret } from 'xstate';

const bookListMachine = createMachine({
  id: "bookList",
  initial: "loading",
  context: {
    books: [{ id: '1' }],
  },
  states: {
    loading: {
      on: {
        FETCH_SUCCESS: 'displayList',
        FETCH_FAILED: 'error'
      }
    },
    error: {
      on: {
        FETCH_RETRY: 'loading'
      }
    },
    displayList: {
      on: {
        CHEKING_BOOKS: [
          { target: 'list', cond: 'isNotEmpty' },
          { target: 'emptyList', cond: 'isEmpty'}
        ]
      }
    },
    list: {},
    emptyList: {}
  }
}, {
  guards: {
    isEmpty: function (context){
      return context.books.length === 0
    },
    isNotEmpty: function (context){
      return context.books.length !== 0
    },
  }
})
.withContext({
  bookList: [{ id: '1' }]
})

const bookList = interpret(bookListMachine)
.onTransition((state) => console.log(state.value))
.start();

bookList.send('FETCH_FAILED')
bookList.send('FETCH_RETRY')
bookList.send('FETCH_SUCCESS')