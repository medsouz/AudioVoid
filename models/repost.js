module.exports = function(sequelize, DataTypes) {
	return sequelize.define("Repost", {
		id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
		type: DataTypes.INTEGER //0 = post, 1 = song
	});
}
