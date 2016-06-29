class AddComments2ToGames < ActiveRecord::Migration
  def change
    add_column :games, :comments2, :text
    rename_column :games, :comments, :comments1
  end
end
