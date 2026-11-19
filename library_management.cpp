/*
 * ============================================================
 *  LIBRARY MANAGEMENT SYSTEM  (C++ OOP Lab Project)
 * ============================================================
 *  OOP concepts demonstrated:
 *   1. Classes & Objects, Encapsulation  -> Item, Member, Library
 *   2. Abstraction (abstract class)      -> Item has pure virtual functions
 *   3. Inheritance                       -> Book, Magazine : Item
 *      Multilevel inheritance            -> ReferenceBook : Book : Item
 *   4. Polymorphism (runtime)            -> virtual functions via Item pointers
 *   5. Constructors / Destructors        -> every class
 *   6. Static data member & function     -> Item::totalItems
 *   7. Operator overloading              -> operator<< (friend), operator==
 *   8. Friend function                   -> operator<< for Item
 *   9. Templates                         -> readNumber<T>()
 *  10. Exception handling                -> LibraryException
 *  11. File handling                     -> items.txt, members.txt
 *  12. STL & smart pointers              -> vector, unique_ptr, algorithm
 *
 *  Compile:  g++ -std=c++17 library_management.cpp -o library
 *  Run:      ./library        (Windows: library.exe)
 * ============================================================
 */

#include <iostream>
#include <fstream>
#include <sstream>
#include <vector>
#include <memory>
#include <string>
#include <algorithm>
#include <stdexcept>
#include <iomanip>
#include <limits>
using namespace std;

// ---------------------------------------------------------------
// Custom exception class (Exception Handling)
// ---------------------------------------------------------------
class LibraryException : public runtime_error {
public:
    explicit LibraryException(const string& msg) : runtime_error(msg) {}
};

// ---------------------------------------------------------------
// ABSTRACT BASE CLASS: Item
// Has pure virtual functions, so objects of Item cannot be created.
// ---------------------------------------------------------------
class Item {
protected:                       // accessible in derived classes
    int id;
    string title;
    int memberId;                // 0 means the item is available
    static int totalItems;       // static member: shared by all objects

public:
    Item(int id, const string& title, int memberId = 0)
        : id(id), title(title), memberId(memberId) {
        totalItems++;
    }

    virtual ~Item() { totalItems--; }       // virtual destructor (important!)

    Item(const Item&) = delete;             // items must not be copied
    Item& operator=(const Item&) = delete;

    // Getters (encapsulation: data is accessed via functions)
    int getId() const { return id; }
    const string& getTitle() const { return title; }
    int getMemberId() const { return memberId; }
    bool isIssued() const { return memberId != 0; }

    // Can be overridden by derived classes (e.g. ReferenceBook)
    virtual void issueTo(int mid) {
        if (isIssued())
            throw LibraryException("This item is already issued.");
        memberId = mid;
    }

    void giveBack() {
        if (!isIssued())
            throw LibraryException("This item was not issued.");
        memberId = 0;
    }

    // Pure virtual functions -> every concrete class MUST implement them
    virtual double calculateFine(int daysLate) const = 0;
    virtual string getType() const = 0;
    virtual string getDetail() const = 0;   // author / issue number etc.

    // Normal virtual functions with default behavior
    virtual string serialize() const {
        return getType() + "|" + to_string(id) + "|" + title + "|" +
               getDetail() + "|" + to_string(memberId);
    }

    virtual void display(ostream& os) const {
        os << left << setw(6) << id
           << setw(11) << getType()
           << setw(28) << title
           << setw(18) << getDetail()
           << (isIssued() ? "Issued to #" + to_string(memberId) : "Available");
    }

    // Friend function + operator overloading: cout << item
    friend ostream& operator<<(ostream& os, const Item& item) {
        item.display(os);            // calls the correct derived version
        return os;
    }

    static int getTotalItems() { return totalItems; }   // static function
};
int Item::totalItems = 0;            // static member definition

// ---------------------------------------------------------------
// DERIVED CLASS: Book
// ---------------------------------------------------------------
class Book : public Item {
protected:
    string author;
public:
    Book(int id, const string& title, const string& author, int memberId = 0)
        : Item(id, title, memberId), author(author) {}

    double calculateFine(int daysLate) const override { return daysLate * 2.0; }   // Rs 2/day
    string getType() const override { return "Book"; }
    string getDetail() const override { return author; }
};

// ---------------------------------------------------------------
// DERIVED CLASS: Magazine
// ---------------------------------------------------------------
class Magazine : public Item {
    int issueNo;
public:
    Magazine(int id, const string& title, int issueNo, int memberId = 0)
        : Item(id, title, memberId), issueNo(issueNo) {}

    double calculateFine(int daysLate) const override { return daysLate * 5.0; }   // Rs 5/day
    string getType() const override { return "Magazine"; }
    string getDetail() const override { return "Issue " + to_string(issueNo); }
};

// ---------------------------------------------------------------
// MULTILEVEL INHERITANCE: ReferenceBook -> Book -> Item
// Reference books can be read in the library but never issued.
// ---------------------------------------------------------------
class ReferenceBook : public Book {
public:
    ReferenceBook(int id, const string& title, const string& author)
        : Book(id, title, author, 0) {}

    void issueTo(int) override {
        throw LibraryException("Reference books cannot be issued.");
    }
    double calculateFine(int) const override { return 0; }
    string getType() const override { return "Reference"; }
};

// ---------------------------------------------------------------
// Member class
// ---------------------------------------------------------------
class Member {
    int id;
    string name;
public:
    Member(int id, const string& name) : id(id), name(name) {}
    int getId() const { return id; }
    const string& getName() const { return name; }

    bool operator==(const Member& other) const { return id == other.id; }  // operator overloading
};

// ---------------------------------------------------------------
// Template function: reads and validates any numeric type
// ---------------------------------------------------------------
template <typename T>
T readNumber(const string& prompt) {
    T value;
    while (true) {
        cout << prompt;
        if (cin >> value) {
            cin.ignore(numeric_limits<streamsize>::max(), '\n');
            return value;
        }
        if (cin.eof()) throw LibraryException("Input closed.");
        cin.clear();
        cin.ignore(numeric_limits<streamsize>::max(), '\n');
        cout << "  Invalid input, please enter a number.\n";
    }
}

string readLine(const string& prompt) {
    string s;
    cout << prompt;
    if (!getline(cin, s)) throw LibraryException("Input closed.");
    return s;
}

string toLower(string s) {
    transform(s.begin(), s.end(), s.begin(), ::tolower);
    return s;
}

// ---------------------------------------------------------------
// Library class: manages everything (composition: Library HAS items & members)
// ---------------------------------------------------------------
class Library {
    vector<unique_ptr<Item>> items;      // polymorphic collection
    vector<Member> members;
    const string itemFile = "items.txt";
    const string memberFile = "members.txt";
    static constexpr int MAX_BORROW = 3;
    static constexpr int ALLOWED_DAYS = 7;

    Item* findItem(int id) {
        for (auto& p : items)
            if (p->getId() == id) return p.get();
        throw LibraryException("Item with ID " + to_string(id) + " not found.");
    }

    Member* findMember(int id) {
        for (auto& m : members)
            if (m.getId() == id) return &m;
        throw LibraryException("Member with ID " + to_string(id) + " not found.");
    }

    int borrowedCount(int mid) const {
        return count_if(items.begin(), items.end(),
                        [mid](const unique_ptr<Item>& p) { return p->getMemberId() == mid; });
    }

    int nextItemId() const {
        int mx = 0;
        for (auto& p : items) mx = max(mx, p->getId());
        return mx + 1;
    }

    int nextMemberId() const {
        int mx = 0;
        for (auto& m : members) mx = max(mx, m.getId());
        return mx + 1;
    }

    static void header() {
        cout << left << setw(6) << "ID" << setw(11) << "Type" << setw(28) << "Title"
             << setw(18) << "Author/Issue" << "Status\n"
             << string(80, '-') << "\n";
    }

public:
    Library() { load(); }
    ~Library() { save(); }               // destructor auto-saves data

    // ---------- Adding ----------
    void addBook() {
        string t = readLine("Title  : ");
        string a = readLine("Author : ");
        if (t.empty() || a.empty()) throw LibraryException("Fields cannot be empty.");
        items.push_back(make_unique<Book>(nextItemId(), t, a));
        cout << "Book added.\n";
    }

    void addMagazine() {
        string t = readLine("Title        : ");
        int no = readNumber<int>("Issue number : ");
        if (t.empty()) throw LibraryException("Title cannot be empty.");
        items.push_back(make_unique<Magazine>(nextItemId(), t, no));
        cout << "Magazine added.\n";
    }

    void addReferenceBook() {
        string t = readLine("Title  : ");
        string a = readLine("Author : ");
        if (t.empty() || a.empty()) throw LibraryException("Fields cannot be empty.");
        items.push_back(make_unique<ReferenceBook>(nextItemId(), t, a));
        cout << "Reference book added.\n";
    }

    void addMember() {
        string n = readLine("Member name : ");
        if (n.empty()) throw LibraryException("Name cannot be empty.");
        int id = nextMemberId();
        members.emplace_back(id, n);
        cout << "Member registered with ID " << id << ".\n";
    }

    // ---------- Display ----------
    void displayAll() const {
        if (items.empty()) { cout << "No items in the library.\n"; return; }
        header();
        for (auto& p : items) cout << *p << "\n";    // uses overloaded <<, polymorphism
        cout << "\nTotal items: " << Item::getTotalItems() << "\n";
    }

    void displayMembers() const {
        if (members.empty()) { cout << "No members registered.\n"; return; }
        cout << left << setw(6) << "ID" << setw(22) << "Name" << "Books borrowed\n"
             << string(45, '-') << "\n";
        for (auto& m : members)
            cout << setw(6) << m.getId() << setw(22) << m.getName()
                 << borrowedCount(m.getId()) << "\n";
    }

    // ---------- Search ----------
    void search() const {
        string key = toLower(readLine("Search title keyword : "));
        bool found = false;
        for (auto& p : items) {
            if (toLower(p->getTitle()).find(key) != string::npos) {
                if (!found) header();
                cout << *p << "\n";
                found = true;
            }
        }
        if (!found) cout << "No matching items.\n";
    }

    // ---------- Issue / Return ----------
    void issue() {
        int iid = readNumber<int>("Item ID   : ");
        int mid = readNumber<int>("Member ID : ");
        Item* item = findItem(iid);
        Member* mem = findMember(mid);
        if (borrowedCount(mid) >= MAX_BORROW)
            throw LibraryException(mem->getName() + " has reached the limit of " +
                                   to_string(MAX_BORROW) + " items.");
        item->issueTo(mem->getId());          // polymorphic call
        cout << "\"" << item->getTitle() << "\" issued to " << mem->getName()
             << " for " << ALLOWED_DAYS << " days.\n";
    }

    void giveBack() {
        int iid = readNumber<int>("Item ID : ");
        Item* item = findItem(iid);
        if (!item->isIssued()) throw LibraryException("This item is not issued.");
        int days = readNumber<int>("Days kept by member : ");
        if (days < 0) throw LibraryException("Days cannot be negative.");
        int late = max(0, days - ALLOWED_DAYS);
        double fine = item->calculateFine(late);   // different fine for each type
        item->giveBack();
        cout << "Item returned.";
        if (fine > 0) cout << " Late by " << late << " day(s). Fine: Rs " << fine;
        cout << "\n";
    }

    // ---------- Delete ----------
    void removeItem() {
        int iid = readNumber<int>("Item ID to remove : ");
        Item* item = findItem(iid);
        if (item->isIssued()) throw LibraryException("Cannot remove an issued item.");
        items.erase(remove_if(items.begin(), items.end(),
                    [iid](const unique_ptr<Item>& p) { return p->getId() == iid; }),
                    items.end());
        cout << "Item removed.\n";
    }

    // ---------- File handling ----------
    void save() const {
        ofstream fi(itemFile), fm(memberFile);
        for (auto& p : items) fi << p->serialize() << "\n";
        for (auto& m : members) fm << m.getId() << "|" << m.getName() << "\n";
    }

    void load() {
        ifstream fi(itemFile);
        string line;
        while (getline(fi, line)) {
            vector<string> f;
            stringstream ss(line);
            string part;
            while (getline(ss, part, '|')) f.push_back(part);
            if (f.size() != 5) continue;                  // skip corrupted lines
            try {
                int id = stoi(f[1]), mid = stoi(f[4]);
                if (f[0] == "Book")
                    items.push_back(make_unique<Book>(id, f[2], f[3], mid));
                else if (f[0] == "Magazine")
                    items.push_back(make_unique<Magazine>(id, f[2], stoi(f[3].substr(6)), mid));
                else if (f[0] == "Reference")
                    items.push_back(make_unique<ReferenceBook>(id, f[2], f[3]));
            } catch (const exception&) { /* ignore bad line */ }
        }
        ifstream fm(memberFile);
        while (getline(fm, line)) {
            size_t pos = line.find('|');
            if (pos == string::npos) continue;
            try {
                members.emplace_back(stoi(line.substr(0, pos)), line.substr(pos + 1));
            } catch (const exception&) {}
        }
    }
};

// ---------------------------------------------------------------
// Menu
// ---------------------------------------------------------------
void showMenu() {
    cout << "\n=========== LIBRARY MANAGEMENT SYSTEM ===========\n"
         << " 1. Add Book              6. Show All Items\n"
         << " 2. Add Magazine          7. Show Members\n"
         << " 3. Add Reference Book    8. Search by Title\n"
         << " 4. Register Member       9. Issue Item\n"
         << " 5. Remove Item          10. Return Item\n"
         << " 0. Save & Exit\n"
         << "=================================================\n";
}

int main() {
    Library lib;
    cout << "Welcome! Data is loaded from items.txt / members.txt if present.\n";

    while (true) {
        try {
            showMenu();
            int choice = readNumber<int>("Enter choice : ");
            switch (choice) {
                case 1:  lib.addBook(); break;
                case 2:  lib.addMagazine(); break;
                case 3:  lib.addReferenceBook(); break;
                case 4:  lib.addMember(); break;
                case 5:  lib.removeItem(); break;
                case 6:  lib.displayAll(); break;
                case 7:  lib.displayMembers(); break;
                case 8:  lib.search(); break;
                case 9:  lib.issue(); break;
                case 10: lib.giveBack(); break;
                case 0:  cout << "Data saved. Goodbye!\n"; return 0;
                default: cout << "Invalid choice.\n";
            }
        } catch (const LibraryException& e) {
            if (string(e.what()) == "Input closed.") return 0;
            cout << "Error: " << e.what() << "\n";
        }
    }
}
