const { Sequelize, DataTypes } = require('sequelize')

const ratings = (sequelize) => {
    /**
     * Rating object definition
     */
    const rating = sequelize.define('Rating', {
        id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        movie_id: {
            type: Sequelize.UUID,
            allowNull: true
        },
        movie_title: {
            type: DataTypes.TEXT,
            allowNull: false,
            defaultValue: ""
        },
        rating: {
            type: DataTypes.DECIMAL(2,1),
            allowNull: false,
            defaultValue: 0
        },
        created_by: {
            type: Sequelize.UUID,
            allowNull: true
        }
    },
    {
        underscored: true,
        updatedAt: 'lastEditedAt',
    })

    return rating
}

module.exports = ratings