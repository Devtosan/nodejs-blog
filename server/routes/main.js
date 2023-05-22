const express = require('express')
const router = express.Router()
const Post = require('../models/Post')




// Router

// Get/
// Home Route
router.get('/',  async (req, res) => {
    try {
        const locals = {
            title:"NodeJs Blog",
            description: "Simple Blog created with NodeJs, Express and MongoDB. "
        }
let perPage = 10
let page = req.query.page || 1

const data = await  Post.aggregate([ {$sort: {createdAt: -1 }}])
.skip(perPage * page - perPage)
.limit(perPage)
.exec()

const count = await Post.count()
const nextPage = parseInt(page)  + 1
const hasNextPage = nextPage <= Math.ceil(count / perPage)
        res.render('index', { 
             locals, 
             data,
             current: page,
             nextPage: hasNextPage ? nextPage : null,
             currentRoute: '/'

             })
    
            } catch (error) {
        console.log(error)
        
    }
})


// Get /
// About Route

router.get('/about', (req, res) => {
    res.render('about', {
        currentRoute: '/about'
    })
})

//Get /
//Contact Route
router.get('/contact', (req, res) => {
    res.render('contact', {
        currentRoute: '/contact'
    })
})



// Get /
// Post : id
 router.get('/post/:id', async (req, res) => {
    try {
        let slug = req.params.id
        const data = await Post.findById({_id: slug})
        const locals = {
            title: data.title,
            description: 'simple Blog created with NodeJs, Express and MongoDB',
            currentRoute: `/post/${slug}`
        }
         res.render('post', ({ locals, data}))
    } catch (error) {
        console.log(error)
    } 
 })



 // POST/
// Post - searchTerm
router.post('/search', async (req, res) => {
    const locals = {
        title: "Search",
        description: "Simple Blog created with NodeJs, Express and MongoDB"
    }
    try {
        let searchTerm = req.body.searchTerm
        const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
        const data = await Post.find({
            $or: [
                {title: {$regex: new RegExp(searchNoSpecialChar, 'i') }},
                {body: {$regex: new RegExp(searchNoSpecialChar, 'i') }}
            ]
        })
        res.render('search', ({ locals, data }))
    } catch (error) {
        console.log(error)
        
    }
})


module.exports = router