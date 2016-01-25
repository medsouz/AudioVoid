module.exports = function(sequelize, DataTypes) {
	return sequelize.define("User", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		username: DataTypes.STRING(20),
		email: DataTypes.STRING(255),
		password: DataTypes.STRING(512),
		registerDate: DataTypes.DATE,
		lastLogonDate: DataTypes.DATE
	});
}
