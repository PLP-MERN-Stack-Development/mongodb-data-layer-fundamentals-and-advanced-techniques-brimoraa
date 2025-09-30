// queries.js
// MongoDB CRUD, advanced queries, aggregation, and indexing

// --- BASIC CRUD ---

// Find all books in a specific genre
db.books.find({ genre: "Programming" })

// Find books published after a certain year
db.books.find({ published_year: { $gt: 2015 } })

// Find books by a specific author
db.books.find({ author: "Robert C. Martin" })

// Update price of a specific book
db.books.updateOne(
  { title: "Clean Code" },
  { $set: { price: 45 } }
)

// Delete a book by its title
db.books.deleteOne({ title: "The Pragmatic Programmer" })


// --- ADVANCED QUERIES ---

// Find books in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

// Projection: return only title, author, price
db.books.find({}, { title: 1, author: 1, price: 1, _id: 0 })

// Sorting
db.books.find().sort({ price: 1 })   // ascending
db.books.find().sort({ price: -1 })  // descending

// Pagination (5 per page)
db.books.find().skip(0).limit(5)  // Page 1
db.books.find().skip(5).limit(5)  // Page 2


// --- AGGREGATION PIPELINES ---

// Average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
])

// Author with the most books
db.books.aggregate([
  { $group: { _id: "$author", bookCount: { $sum: 1 } } },
  { $sort: { bookCount: -1 } },
  { $limit: 1 }
])

// Group books by decade
db.books.aggregate([
  { $project: { decade: { $subtract: ["$published_year", { $mod: ["$published_year", 10] }] } } },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])


// --- INDEXING ---

// Index on title
db.books.createIndex({ title: 1 })

// Compound index on author + published_year
db.books.createIndex({ author: 1, published_year: -1 })

// Explain performance
db.books.find({ title: "Clean Code" }).explain("executionStats")
