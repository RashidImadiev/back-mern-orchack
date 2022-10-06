import express from 'express'
import mongoose from "mongoose";
import multer from 'multer'
import cors from 'cors'
import {registerValidation, loginValidation, postCreateValidation} from "./validations.js";
import checkAuth from "./utils/checkAuth.js";
// import {register, login, getMe} from "./controllers/UserController.js";
import * as UseController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
	.connect(process.env.MONGODB_URI)
	.then(() => console.log('DB ok!'))
	.catch((err) => console.log('DB err', err))

const app = express()

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads')
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname)
	}
})
const upload = multer({storage})


app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))

app.post('/auth/login', loginValidation, handleValidationErrors, UseController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UseController.register)
app.get('/auth/me', checkAuth, UseController.getMe)

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
	res.json({
		url: `/uploads/${req.file.originalname}`
	})
})

app.get('/posts', PostController.getAll)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.get('/tags', PostController.getLastTags)
app.get('/posts/tags', PostController.getLastTags)

const PORT = process.env.PORT || 4444
app.listen(PORT, (err) => {
	if (err) {
		console.log(err)
	}

	console.log(`Server start on PORT 4444`)
})
