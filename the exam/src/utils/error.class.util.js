export class ErrorHandleClass {
  constructor(message, status, data, location, name, stack) {
    this.message = message;
    this.status = status;
    this.data = data;
    this.location = location;
    this.name = name ? name : "Error";
    this.stack = stack ? stack : null;
  }
}
