/* eslint-disable linebreak-style */
const { nanoid } = require('nanoid');
const books = require('./books');
const {
  // eslint-disable-next-line no-unused-vars
  failResponse, successResponse, errorResponse, bookMapped,
} = require('./respons');

const addBookHandler = (request, h) => {
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const id = nanoid(16);
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;
  const finished = pageCount === readPage;
  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (name === undefined) {
    return h.response(failResponse({
      responseMessage: 'Gagal menambahkan buku. Mohon isi nama buku',
      withData: false,
    }))
      .code(400);
  }

  if (readPage > pageCount) {
    return h.response(failResponse({
      responseMessage: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      withData: false,
    }))
      .code(400);
  }

  books.push(newBook);
  console.log(newBook);

  const isSuccess = books.filter((book) => book.id === id).length > 0;
  if (isSuccess) {
    return h.response(successResponse({
      responseMessage: 'Buku berhasil ditambahkan',
      responseData: { bookId: newBook.id },
    }))
      .code(201);
  }

  return h.response(errorResponse(
    'Buku gagal ditambahkan',
  ))
    .code(500);
};

const getAllBookHandler = (request) => {
  const { name, reading, finished } = request.query;

  let filteredBooks = books;

  if (name) {
    filteredBooks = books.filter((book) => new RegExp(name, 'i').test(book.name))
      .code(200);
  }

  if (reading !== undefined) {
    filteredBooks = books.filter((book) => !!Number(reading) === book.reading)
      .code(200);
  }

  if (finished !== undefined) {
    filteredBooks = books.filter((book) => !!Number(finished) === book.finished)
      .code(200);
  }

  return {
    status: 'success',
    data: {
      books: filteredBooks.map(({ id, name: bookName, publisher }) => (
        { id, name: bookName, publisher }
      )),
    },
  };
};

const getBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const book = books.filter((b) => b.id === id)[0];
  if (book !== undefined) {
    return h.response(successResponse({
      responseData: { book },
    }))
      .code(200);
  }

  return h.response(failResponse({
    responseMessage: 'Buku tidak ditemukan',
    withData: false,
  }))
    .code(404);
};

const editBookByIdHandler = (request, h) => {
  const { id } = request.params;
  const {
    name, year, author, summary, publisher, pageCount, readPage, reading,
  } = request.payload;
  const updatedAt = new Date().toISOString();

  const index = books.findIndex((book) => book.id === id);
  if (name === undefined) {
    return h.response(failResponse({
      responseMessage: 'Gagal memperbarui buku. Mohon isi nama buku',
      withData: false,
    }))
      .code(400);
  }

  if (readPage > pageCount) {
    return h.response(failResponse({
      responseMessage: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      withData: false,
    }))
      .code(400);
  }

  if (index !== -1) {
    books[index] = {
      ...books[index],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    return h.response(successResponse({
      responseMessage: 'Buku berhasil diperbarui',
    }))
      .code(200);
  }

  return h.response(failResponse({
    responseMessage: 'Gagal memperbarui buku. Id tidak ditemukan',
    withData: false,
  }))
    .code(404);
};

const deleteBookById = (request, h) => {
  const { id } = request.params;
  const index = books.findIndex((b) => b.id === id);

  if (index !== -1) {
    books.splice(index, 1);
    return h.response(successResponse({
      responseMessage: 'Buku berhasil dihapus',
    }))
      .code(200);
  }

  return h.response(failResponse({
    responseMessage: 'Buku gagal dihapus. Id tidak ditemukan',
    withData: false,
  }))
    .code(404);
};

module.exports = {
  addBookHandler, getAllBookHandler, getBookByIdHandler, editBookByIdHandler, deleteBookById,
// eslint-disable-next-line linebreak-style
};
