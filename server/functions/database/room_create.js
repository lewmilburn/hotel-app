module.exports = async function (client, type, room_number, floor, max_guests, price, description) {
    try {
        await client.connect();
        const database = client.db("COMP3006Hotel");
        const rooms = database.collection("rooms");

        const query = {'room_number': room_number};
        const options = {};

        rooms.find(query, options);
        if ((await rooms.countDocuments(query)) === 0) {
            await rooms.insertOne(
                {
                    type: type,
                    room_number: room_number,
                    floor: floor,
                    max_guests: max_guests,
                    price: price,
                    description: description
                }
            )
            return true;
        } else {
            return false;
        }
    } finally {
        await client.close();
    }
}