import { PrismaClient, User } from '@prisma/client'

const prismaClientSingleton = () => {
   return new PrismaClient().$extends({
      result: {
        user: {
          fullName: {
            needs: { first_name: true, last_name: true },
            compute(user: User) {
              return `${user.first_name} ${user.last_name}`
            },
          }
        },
      },
    })
 }
 
 declare const globalThis: {
   prismaGlobal: PrismaClient
 } & typeof global;
 
 const prisma = globalThis.prismaGlobal ?? prismaClientSingleton()
 
 export default prisma as PrismaClient
 
 if (process.env.NODE_ENV !== 'production') globalThis.prismaGlobal = prisma as PrismaClient
