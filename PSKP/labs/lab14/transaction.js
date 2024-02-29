const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const updateAuditoriumCapacity = async () => {
    try {
        await prisma.$transaction(async prisma => {
            await prisma.auditorium.updateMany({
                data: {
                    auditorium_capacity: {
                        increment: 100
                    }
                }
            });

            throw new Error('Transaction rollback');
        });

    } catch (error) {
        console.error(error);
    }
};

const main = async () => {
    await updateAuditoriumCapacity();
    await prisma.$disconnect();
};

main();