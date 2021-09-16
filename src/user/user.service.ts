import { Injectable } from '@nestjs/common';
import { User } from 'src/entity/user.entity';
import { getRepository } from 'typeorm';
var CryptoJS = require('crypto-js');
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
    host: "in-v3.mailjet.com",
    port: 587,
    secure: false,
    auth: {
      user: 'b48ebf08e4abac2ad88a47f9bfa54651',
      pass: '43420b684488ac5bd3a964eaf0063e54', 
    },
  });

@Injectable()
export class UserService {

    async getUser(username: string) : Promise<User>{
        const userRepository = getRepository(User);
        const user = await userRepository.findOne({
            select: ["id", "username", "password"],
            where: {
                username: username
            }
        });
        return user;
    }

    async getAll() : Promise<User[]>{
        const userRepository = getRepository(User);
        const users = await userRepository.find({
            select: ["id", "username", "email"]
        });
        return users;
    }

    // Generate email Code
    generateCode(){
        var emailCode = "";
        for(var i =0; i < 6; i++){          
            emailCode +=  Math.floor(Math.random() * (9 + 1)).toString();
        }
        return emailCode;
    }

    // Verifier si un user est deja active
    async existEmail(email: string){
        try {
            const userRepository = getRepository(User);
            const user = await userRepository.findOne({
                email: email,
                isActive: true
            });

            if(user){
                return {
                    status: 'success',
                    data: 1
                }
            }
            else {
                return {
                    status: 'success',
                    data: 0
                }
            }

        }
        catch (err){
            // catch and return error
            return {
                status: 'error',
                message: err.message,
                localisation: 'USER_EXIST_ERROR'
            }
        }
    }

    // Verifier si un user est deja active
    async exist(username: string){
        try {
            const userRepository = getRepository(User);
            const user = await userRepository.findOne({
                username: username,
                isActive: true
            });

            if(user){
                return {
                    status: 'success',
                    data: 1
                }
            }
            else {
                return {
                    status: 'success',
                    data: 0
                }
            }

        }
        catch (err){
            // catch and return error
            return {
                status: 'error',
                message: err.message,
                localisation: 'USER_EXIST_ERROR'
            }
        }
    }

    // Pre inscription avant validation via Email
    async preInscription(body: User){
        try {
            // get repositories
            const userRepository = getRepository(User);

            await userRepository.delete({
                username: body.username,
                isActive: false
            });

            await userRepository.delete({
                username: body.username,
                isActive: false
            });

            await userRepository.delete({
                email: body.email,
                isActive: false
            });

            // generate random email code
            body.emailCode = this.generateCode();

            // Hash password 2nd time
            body.password = CryptoJS.SHA512(body.password).toString();
      
            // Save not activated user
            const user = await userRepository.save<User>(body);

            // Send email with the code to the phoneNumber

            let info = await transporter.sendMail({
                from: '"No reply Task Manager" <cherif.benda@gmail.com>', // sender address
                to: body.email, // list of receivers
                subject: "Confirmation code", // Subject line
                text: "Your code is " + body.emailCode, // plain text body
              });

            // Return success
            return {
                status: 'success',
                message: 'Email envoyée'
            };
        }
        catch (err){
            // catch and return error
            return {
                status: 'error',
                message: err.message,
                localisation: 'PRE_INSCRIPTION_ERROR'
            }
        }
        
    }

    // Confirmation de l'inscription via code email
    async validationInscription(body: User){
        try {
            // get repositories
            const userRepository = getRepository(User);
            const user = await userRepository.findOne({
                username: body.username,
                email: body.email,
                emailCode: body.emailCode
            });
            if(user) {
                // Set user to active
                await userRepository.update({
                    username: body.username,
                    email: body.email,
                    emailCode: body.emailCode
                },
                {
                    isActive: true
                });
                // Return success
                return {
                    status: 'success',
                    message: 'Confirmation OK',
                    data: 1
                };
            }
            else {
                return {
                    status: 'error',
                    message: 'Le code ne correspond pas veuillez réessayer',
                    data: 0,
                    localisation: 'VALIDATION_INSCRIPTION_ERROR'
                }
            }
        }
        catch (err) {
            // catch and return error
            return {
                status: 'error',
                message: err.message,
                localisation: 'VALIDATION_INSCRIPTION_ERROR'
            }
        }
    }
}
