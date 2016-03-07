module.exports = function(sequelize, DataTypes) {
	return sequelize.define("User", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		username: DataTypes.STRING(20),
		email: DataTypes.STRING(255),
		password: DataTypes.STRING(512),
		bio: DataTypes.STRING(512),
		twitter: DataTypes.STRING(15),
		soundcloud: DataTypes.STRING(30)
	});
}
