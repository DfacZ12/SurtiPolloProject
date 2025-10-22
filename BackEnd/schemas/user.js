import mongoose from "mongoose";

export default userSchema = new mongoose.Schema({
  CC: { type: Number, required: true, unique: true }, // BigInt
  Name: { type: String, required: true, maxlength: 120 },
  LastName: { type: String, required: true, maxlength: 120 },
  Address: { type: String, required: true, maxlength: 120 },
  EPS: { type: Number, required: true, ref: "EPS" }, // Foreign Key
  Phone: { type: Number, required: true },
  CellPhone: { type: Number },
  Mail: { type: String, required: true, maxlength: 100 },
  Registered_by: { type: Number, required: true, ref: "Usuario" }, // Foreign Key
  Username: { type: String, required: true, unique: true, maxlength: 30 },
  Password: { type: String, required: true, minlength: 8 },
  position: { type: String, required: true, maxlength: 1 }, //Revisar si no se necesita cambiar el tipo de dato para hacer tabla position aparte
  state: { type: boolean, required: true, maxlength: 1 },
});

userSchema.pre("save", function (next) {
  if (!(this.isModified("Password") || this.isNew)) {
    next();
    return
  }
  const document = this;
  bcrypt.hash(document.Password, 10, (err, hashedPassword) => {
    if (!err) {
      document.Password = hashedPassword;
      next();
      return
    }
    next(err);
  });
});

// export default mongoose.model("Usuario", userSchema);
