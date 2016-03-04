module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Song", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		title: DataTypes.STRING(30),
		genre: DataTypes.STRING(20),
		description: DataTypes.STRING(100)
	});
}
