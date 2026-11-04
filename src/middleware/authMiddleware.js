import jwt from 'jsonwebtoken'

function authMiddleware(req,res,next){
    //get the token fropm the Authorization header
    const token = req.headers['authorization']

    //no token = we stop
    if (!token) {
        return res.status(401).json({Message: 'No token provided'})
    }

    //check the token is real and not expired
    // the token already carries the payload (user id) inside it.
    // verify uses JWT_SECRET to check the signature (token not changed, not expired),
    //signature = base64url( HMAC_SHA256( JWT_SECRET , header + "." + payload ) )
    //The function: HMAC-SHA256, which is what "alg": "HS256" in the header means. It hashes header.payload using the secret as the key and outputs 32 bytes.
    // then gives us the payload back as `decoded`.
    
    jwt.verify(token, process.env.JWT_SECRET, (err,decoded)=>{
        if(err) {
            return res.status(401).json ({message: 'Invalido token'})
        }
        //token accepted, means that jwt.verify passes the value of payload to decoded ={ id: 1, iat: 1730750000, exp: 1730836400 }
        req.userId = decoded.id
        console.log(decoded)
        //let the request continue to the route
        next()
    })

}

export default authMiddleware