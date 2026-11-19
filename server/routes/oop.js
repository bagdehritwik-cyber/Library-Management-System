const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const CPP_FILE = path.join(__dirname, '..', '..', 'library_management.cpp');

const oopConcepts = [
  {
    id: 'classes-and-objects',
    title: 'Classes and Objects',
    category: 'Core OOP',
    classesInvolved: ['Item', 'Book', 'Magazine', 'ReferenceBook', 'Member', 'Library'],
    functionsInvolved: ['main()', 'Library::addBook()', 'Library::addMember()'],
    description: 'Classes serve as blueprints encapsulating data members and member functions. Objects are concrete runtime instances created from these blueprints, such as Book, Magazine, and Member objects created dynamically in the library.',
    codeSnippet: `// Classes define structure and behavior
class Member {
    int id;
    string name;
public:
    Member(int id, const string& name) : id(id), name(name) {}
    int getId() const { return id; }
    const string& getName() const { return name; }
    bool operator==(const Member& other) const { return id == other.id; }
};

// Objects are instantiated
members.emplace_back(id, n);
items.push_back(make_unique<Book>(nextItemId(), t, a));`,
    lineRange: 'Lines 163-172, 260, 284'
  },
  {
    id: 'encapsulation',
    title: 'Encapsulation',
    category: 'Core OOP',
    classesInvolved: ['Item', 'Member', 'Library'],
    functionsInvolved: ['getId()', 'getTitle()', 'getMemberId()', 'isIssued()', 'findItem()', 'findMember()'],
    description: 'Data hiding is strictly enforced using access specifiers (private and protected). Member variables like id, title, and memberId cannot be modified arbitrarily from outside; access is mediated through public getter methods and validated member functions.',
    codeSnippet: `class Item {
protected:                       // accessible in derived classes only
    int id;
    string title;
    int memberId;                // 0 means available
    static int totalItems;

public:
    // Controlled access via getters
    int getId() const { return id; }
    const string& getTitle() const { return title; }
    int getMemberId() const { return memberId; }
    bool isIssued() const { return memberId != 0; }
};`,
    lineRange: 'Lines 50-72'
  },
  {
    id: 'abstraction',
    title: 'Abstraction',
    category: 'Core OOP',
    classesInvolved: ['Item'],
    functionsInvolved: ['calculateFine() = 0', 'getType() = 0', 'getDetail() = 0'],
    description: 'Item is an Abstract Base Class (ABC) that hides complex implementation details and exposes only high-level interfaces. Pure virtual functions (= 0) mandate that derived classes provide concrete implementations, making it impossible to directly instantiate Item.',
    codeSnippet: `class Item {
    // ...
public:
    // Pure virtual functions -> Item cannot be instantiated directly
    virtual double calculateFine(int daysLate) const = 0;
    virtual string getType() const = 0;
    virtual string getDetail() const = 0;   // author / issue number
};`,
    lineRange: 'Lines 86-90'
  },
  {
    id: 'inheritance',
    title: 'Inheritance',
    category: 'Core OOP',
    classesInvolved: ['Book : public Item', 'Magazine : public Item'],
    functionsInvolved: ['Book::Book()', 'Magazine::Magazine()'],
    description: 'Enables code reusability and hierarchical classification. Book and Magazine publicly inherit from Item, gaining common attributes (id, title, memberId, issue status) while extending them with specialized data (author, issueNo).',
    codeSnippet: `// Book inherits from Item
class Book : public Item {
protected:
    string author;
public:
    Book(int id, const string& title, const string& author, int memberId = 0)
        : Item(id, title, memberId), author(author) {}
    // ...
};

// Magazine inherits from Item
class Magazine : public Item {
    int issueNo;
public:
    Magazine(int id, const string& title, int issueNo, int memberId = 0)
        : Item(id, title, memberId), issueNo(issueNo) {}
    // ...
};`,
    lineRange: 'Lines 118-142'
  },
  {
    id: 'multilevel-inheritance',
    title: 'Multilevel Inheritance',
    category: 'Inheritance',
    classesInvolved: ['ReferenceBook -> Book -> Item'],
    functionsInvolved: ['ReferenceBook::issueTo()', 'ReferenceBook::calculateFine()'],
    description: 'A class extends another derived class. ReferenceBook inherits from Book, which inherits from Item. ReferenceBook specializes Book by overriding issueTo() to disallow lending, enforcing that reference materials stay within the library.',
    codeSnippet: `// MULTILEVEL INHERITANCE: ReferenceBook -> Book -> Item
class ReferenceBook : public Book {
public:
    ReferenceBook(int id, const string& title, const string& author)
        : Book(id, title, author, 0) {}

    void issueTo(int) override {
        throw LibraryException("Reference books cannot be issued.");
    }
    double calculateFine(int) const override { return 0; }
    string getType() const override { return "Reference"; }
};`,
    lineRange: 'Lines 148-158'
  },
  {
    id: 'runtime-polymorphism',
    title: 'Runtime Polymorphism',
    category: 'Polymorphism',
    classesInvolved: ['Item', 'Book', 'Magazine', 'ReferenceBook', 'Library'],
    functionsInvolved: ['calculateFine()', 'getType()', 'getDetail()', 'display()', 'issueTo()'],
    description: 'Dynamic binding achieved through base class pointers (Item*) and virtual functions. When iterating over vector<unique_ptr<Item>>, C++ resolves the appropriate derived method at runtime based on the actual object type via the vtable.',
    codeSnippet: `// Stored as generic base class pointers:
vector<unique_ptr<Item>> items;

// At runtime, C++ dispatches to the correct derived version:
for (auto& p : items) {
    cout << *p << "\\n"; // calls p->display()
}

// In giveBack(): calls Book or Magazine's specific fine formula
double fine = item->calculateFine(late);`,
    lineRange: 'Lines 209, 292, 340'
  },
  {
    id: 'function-overriding',
    title: 'Function Overriding',
    category: 'Polymorphism',
    classesInvolved: ['Book', 'Magazine', 'ReferenceBook'],
    functionsInvolved: ['calculateFine()', 'getType()', 'getDetail()', 'issueTo()'],
    description: 'Derived classes provide specific implementations of virtual functions declared in base classes. The "override" keyword guarantees compile-time verification of signature matching.',
    codeSnippet: `// In Book:
double calculateFine(int daysLate) const override { return daysLate * 2.0; } // ₹2/day
string getType() const override { return "Book"; }

// In Magazine:
double calculateFine(int daysLate) const override { return daysLate * 5.0; } // ₹5/day
string getType() const override { return "Magazine"; }

// In ReferenceBook:
void issueTo(int) override {
    throw LibraryException("Reference books cannot be issued.");
}`,
    lineRange: 'Lines 125-127, 139-141, 153-155'
  },
  {
    id: 'constructors-and-destructors',
    title: 'Constructors and Destructors',
    category: 'Object Lifecycle',
    classesInvolved: ['Item', 'Book', 'Magazine', 'ReferenceBook', 'Member', 'Library'],
    functionsInvolved: ['Item::Item()', 'Item::~Item()', 'Library::Library()', 'Library::~Library()'],
    description: 'Constructors initialize object state using member initializer lists. The virtual destructor in Item guarantees derived class destructors are called when deleted polymorphically. The Library constructor auto-loads data from disk, and its destructor auto-saves data on program exit.',
    codeSnippet: `// Virtual Destructor in Item
virtual ~Item() { totalItems--; }

// Library RAII: Constructor loads, Destructor saves
Library() { load(); }
~Library() { save(); }  // destructor auto-saves data on exit

// Parameterized constructor with initializer list
Item(int id, const string& title, int memberId = 0)
    : id(id), title(title), memberId(memberId) {
    totalItems++;
}`,
    lineRange: 'Lines 57-62, 252-253'
  },
  {
    id: 'static-members',
    title: 'Static Members',
    category: 'Advanced OOP',
    classesInvolved: ['Item', 'Library'],
    functionsInvolved: ['Item::totalItems', 'Item::getTotalItems()', 'Library::MAX_BORROW', 'Library::ALLOWED_DAYS'],
    description: 'Static members belong to the class itself rather than individual instances. Item::totalItems tracks the global count of existing items, incremented on construction and decremented on destruction. Library contains static constexpr constants.',
    codeSnippet: `class Item {
protected:
    static int totalItems; // shared across all Item objects
public:
    static int getTotalItems() { return totalItems; }
};

int Item::totalItems = 0; // static definition outside class

// In Library:
static constexpr int MAX_BORROW = 3;
static constexpr int ALLOWED_DAYS = 7;`,
    lineRange: 'Lines 54, 111-113, 213-214'
  },
  {
    id: 'operator-overloading',
    title: 'Operator Overloading',
    category: 'Advanced OOP',
    classesInvolved: ['Item', 'Member'],
    functionsInvolved: ['operator<<', 'operator=='],
    description: 'Extends C++ operators to work seamlessly with user-defined types. operator<< allows items to be printed directly using "cout << *p", and operator== compares members by their unique ID.',
    codeSnippet: `// Overloading << for stream output (friend function)
friend ostream& operator<<(ostream& os, const Item& item) {
    item.display(os); // calls virtual display
    return os;
}

// In Member: Overloading == for equality comparison
bool operator==(const Member& other) const {
    return id == other.id;
}`,
    lineRange: 'Lines 106-109, 171'
  },
  {
    id: 'friend-functions',
    title: 'Friend Functions',
    category: 'Advanced OOP',
    classesInvolved: ['Item'],
    functionsInvolved: ['friend ostream& operator<<(ostream& os, const Item& item)'],
    description: 'A friend function is granted direct access to private and protected members of a class without being a member method. Used to overload binary stream operators like << where the left operand is ostream&.',
    codeSnippet: `class Item {
    // ...
    // Friend function has access to protected members of Item
    friend ostream& operator<<(ostream& os, const Item& item) {
        item.display(os); // calls the correct derived version
        return os;
    }
};`,
    lineRange: 'Lines 106-109'
  },
  {
    id: 'templates',
    title: 'Templates',
    category: 'Generic Programming',
    classesInvolved: ['Generic utility function'],
    functionsInvolved: ['readNumber<T>()'],
    description: 'Templates enable type-independent generic programming. readNumber<T>() works with any numeric type (int, float, double), providing robust input validation, clearing stream errors, and flushing buffers.',
    codeSnippet: `template <typename T>
T readNumber(const string& prompt) {
    T value;
    while (true) {
        cout << prompt;
        if (cin >> value) {
            cin.ignore(numeric_limits<streamsize>::max(), '\\n');
            return value;
        }
        if (cin.eof()) throw LibraryException("Input closed.");
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\\n');
        cout << "  Invalid input, please enter a number.\\n";
    }
}`,
    lineRange: 'Lines 177-191'
  },
  {
    id: 'exception-handling',
    title: 'Exception Handling',
    category: 'Robustness',
    classesInvolved: ['LibraryException : public runtime_error'],
    functionsInvolved: ['issueTo()', 'giveBack()', 'removeItem()', 'main()'],
    description: 'Structured error handling using try, catch, and throw. A custom LibraryException derived from std::runtime_error handles domain-specific violations (borrow limit reached, item not issued, input errors) without crashing the application.',
    codeSnippet: `// Custom exception class
class LibraryException : public runtime_error {
public:
    explicit LibraryException(const string& msg) : runtime_error(msg) {}
};

// Throwing exception
if (borrowedCount(mid) >= MAX_BORROW)
    throw LibraryException(mem->getName() + " has reached the limit of " + to_string(MAX_BORROW) + " items.");

// Catching in main loop
try {
    // execute user command
} catch (const LibraryException& e) {
    cout << "Error: " << e.what() << "\\n";
}`,
    lineRange: 'Lines 40-43, 326-327, 431-434'
  },
  {
    id: 'file-handling',
    title: 'File Handling',
    category: 'Persistence',
    classesInvolved: ['Library', 'Item', 'Member'],
    functionsInvolved: ['Library::save()', 'Library::load()', 'Item::serialize()'],
    description: 'Data persistence implemented using std::ifstream and std::ofstream. Items and members are serialized to items.txt and members.txt with pipe delimiters and parsed on startup.',
    codeSnippet: `// Save data to disk
void save() const {
    ofstream fi(itemFile), fm(memberFile);
    for (auto& p : items) fi << p->serialize() << "\\n";
    for (auto& m : members) fm << m.getId() << "|" << m.getName() << "\\n";
}

// Load data on startup
void load() {
    ifstream fi(itemFile);
    string line;
    while (getline(fi, line)) {
        // parse and reconstruct Book, Magazine, or ReferenceBook
    }
}`,
    lineRange: 'Lines 359-392'
  },
  {
    id: 'stl-and-smart-pointers',
    title: 'STL and Smart Pointers',
    category: 'Modern C++',
    classesInvolved: ['Library'],
    functionsInvolved: ['std::vector', 'std::unique_ptr', 'std::count_if', 'std::remove_if', 'std::transform'],
    description: 'Utilizes modern C++17 memory management and algorithms. std::unique_ptr ensures exclusive ownership and automatic deletion without memory leaks. Algorithms like count_if and remove_if replace manual loops with expressive standard library algorithms.',
    codeSnippet: `// Smart pointers with exclusive ownership:
vector<unique_ptr<Item>> items;

// STL algorithm for counting:
int borrowedCount(int mid) const {
    return count_if(items.begin(), items.end(),
        [mid](const unique_ptr<Item>& p) { return p->getMemberId() == mid; });
}

// STL algorithm for removing items:
items.erase(remove_if(items.begin(), items.end(),
    [iid](const unique_ptr<Item>& p) { return p->getId() == iid; }),
    items.end());`,
    lineRange: 'Lines 209, 228-231, 352-355'
  },
  {
    id: 'composition',
    title: 'Composition',
    category: 'Architecture',
    classesInvolved: ['Library', 'Item', 'Member'],
    functionsInvolved: ['Library class definition'],
    description: 'Demonstrates a strong "has-a" relationship. Library is composed of collections of Items and Members. It owns and coordinates their lifecycle, handling input/output, queries, transactions, and persistence.',
    codeSnippet: `class Library {
    // Library HAS-A collection of items and members (Composition)
    vector<unique_ptr<Item>> items;      // polymorphic collection
    vector<Member> members;
    const string itemFile = "items.txt";
    const string memberFile = "members.txt";

public:
    Library() { load(); }
    ~Library() { save(); }
    // Coordinates all operations on items and members
};`,
    lineRange: 'Lines 208-215'
  }
];

// GET all OOP concepts
router.get('/', (req, res) => {
  res.json({
    success: true,
    count: oopConcepts.length,
    concepts: oopConcepts
  });
});

// GET raw C++ source code with line markers
router.get('/source-code', (req, res) => {
  try {
    if (fs.existsSync(CPP_FILE)) {
      const code = fs.readFileSync(CPP_FILE, 'utf-8');
      res.json({
        success: true,
        filename: 'library_management.cpp',
        code
      });
    } else {
      res.status(404).json({ success: false, message: 'library_management.cpp not found.' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
