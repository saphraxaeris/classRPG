# TO-DO - General
* Professors create assignments for class
* Students can complete assignments of a class

# TO-DO - Back End
## Endpoints
### Register Post:
* Register Post:
* Send: { username: username, name: name, email: email, studentId: studentId, password: password, student: true }
* Recieve Ok: user object without password
* Recieve error: string message with error to show to user

### Login Post:
* Recieve Ok: user object without password

### GET: /user/profile
* Return page

### POST: /user/profile
* Send: { password: password }
* Recieve Ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

### GET: /user/inventory
* Return page

### GET: /user/getInventory
* Send: User
* Recieve Ok: Item[] of items in that user's inventory
* Recieve error: [nothing extra needed]

### GET: /classes/classes
* Return page

### GET: /classes/getClasses
* Send: User
* Recieve Ok: If user == student Class[] of classes that student is in. If user != student Class[] of classes that professor teaches
* Recieve error: string message with error to show to user

### GET: /classes/class?userId=[id]&classId=[id]
* Return: If userId belongs to student classStudent.html, else classProfessor.html

### Get: /classes/classInfoStudent
* Send: { classId: classId }
* Recieve Ok: Class object
* Recieve error: string message with error to show to user

### Get: /classes/classInfoProfessor
* Send: { classId: classId }
* Recieve Ok: { classInfo: [class object], items: [ Item[] of items associated to class ] }
* Recieve error: string message with error to show to user

### POST: /classes/update
* Send: { classId: classId, officeHours: officeHours }
* Recieve Ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

### POST: /classes/addItem
* Send: (classId: classId, name: itemName, effect: itemEffect, sprite: sprite)
* Recieve Ok: [nothing extra needed]
* Recieve error: [nothing extra needed]

## Objects:
* User: { [something] id, string username, string name string email, string studentId, string password, bool student, string office, int gold }
* Class: { [something] id, string name, User professor, string department, string code, string officeHours }
* Announcements: { [something] id, [something] classId, string title, string description }
* Item: { [something] id, [something] classId, string className, string name, string effect, string sprite }