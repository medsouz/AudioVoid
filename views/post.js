module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Post", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		message: DataTypes.STRING(512)
	});
}
