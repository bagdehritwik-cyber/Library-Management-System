# Library Management System (C++)

A terminal-based Library Management System built in C++ for the Object Oriented Programming lab. It manages books, magazines, reference books and members, and demonstrates the major OOP concepts in a single, easy-to-read source file.

**Name:** _Your Name_
**Roll No:** _Your Roll Number_
**Course:** Object Oriented Programming (C++), B.Tech CSE (AI/ML), IIIT Nagpur
**Submitted to:** _Teacher's Name_

---

## Features

- Add books, magazines and reference books
- Register library members
- Issue and return items
- Late fine calculation (different rate for each item type)
- Search items by title keyword
- Show all items and all members
- Remove items from the library
- Data is saved to files and loaded automatically on the next run
- Input validation and error handling (no crashes on wrong input)

## Rules built into the system

| Rule | Value |
|---|---|
| Maximum items a member can borrow | 3 |
| Loan period | 7 days |
| Fine for a Book | Rs 2 per late day |
| Fine for a Magazine | Rs 5 per late day |
| Reference books | Cannot be issued, no fine |
| Issued items | Cannot be removed |

---

## How to Compile and Run

You need a C++ compiler such as **g++** (C++14 or newer).

**Windows / Linux / Mac:**

```
g++ -std=c++17 library_management.cpp -o library
```

Then run:

```
library.exe        (Windows)
./library          (Linux / Mac)
```

> Run the program from the same folder every time, because `items.txt` and `members.txt` are created in the folder where you run it.
> Always exit with **option 0**, which saves your data.

---

## Menu

```
=========== LIBRARY MANAGEMENT SYSTEM ===========
 1. Add Book              6. Show All Items
 2. Add Magazine          7. Show Members
 3. Add Reference Book    8. Search by Title
 4. Register Member       9. Issue Item
 5. Remove Item          10. Return Item
 0. Save & Exit
=================================================
```

## Sample Run

1. Choose `4`, then enter a member name (for example, Rahul).
2. Choose `1`, then add a book (for example, Clean Code by Robert Martin).
3. Choose `9`, then enter the item ID and the member ID to issue it.
4. Choose `6` to see the item shown as "Issued to #1".
5. Choose `10`, enter the item ID and days kept (for example, 10) to see a late fine.
6. Choose `0` to save and exit.

---

## OOP Concepts Used

| Concept | Where it is used |
|---|---|
| Classes and Objects | `Item`, `Book`, `Magazine`, `ReferenceBook`, `Member`, `Library` |
| Encapsulation | Data members are `protected` or `private` and accessed through getters |
| Abstraction | `Item` is an abstract class with pure virtual functions |
| Inheritance | `Book` and `Magazine` inherit from `Item` |
| Multilevel inheritance | `ReferenceBook` → `Book` → `Item` |
| Runtime polymorphism | `vector<unique_ptr<Item>>` calls the correct overridden function for each type |
| Function overriding | `calculateFine()`, `getType()`, `getDetail()`, `issueTo()` |
| Constructors and destructors | Library loads data in its constructor and saves in its destructor |
| Virtual destructor | `Item` has a virtual destructor for safe deletion via base pointers |
| Static members | `Item::totalItems` and `getTotalItems()` |
| Operator overloading | `operator<<` for printing items, `operator==` for members |
| Friend function | `operator<<` is a friend of `Item` |
| Templates | `readNumber<T>()` validates numeric input of any type |
| Exception handling | Custom `LibraryException` with `try` / `catch` |
| File handling | `ifstream` / `ofstream` for saving and loading |
| STL and smart pointers | `vector`, `unique_ptr`, `count_if`, `remove_if`, `transform` |
| Composition | `Library` owns its items and members |

## Class Structure

```
            Item  (abstract)
           /     \
        Book    Magazine
         |
   ReferenceBook

   Member            Library  (has many Items and Members)
```

## Data Files

Items are saved one per line in `items.txt`, with fields separated by `|`:

```
Book|1|Clean Code|Robert Martin|1
Magazine|2|Wired|Issue 12|0
Reference|3|C++ Primer|Lippman|0
```

Format: `Type|ID|Title|Author or Issue|MemberID` (a member ID of `0` means the item is available).

Members are saved in `members.txt`:

```
1|Rahul
```

## Project Files

| File | Purpose |
|---|---|
| `library_management.cpp` | Complete source code |
| `README.md` | Project documentation |
| `items.txt` | Created automatically, stores items |
| `members.txt` | Created automatically, stores members |

## Possible Future Improvements

- Graphical interface (Qt or similar)
- Member login with passwords
- Due dates using real calendar dates
- Overdue items report
- Database storage instead of text files
