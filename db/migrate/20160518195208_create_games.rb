class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :user1, null: false
      t.integer :user2
      t.boolean :winner
      t.text :comments

      t.timestamps null: false
    end
    add_index :games, [:user1, :user2]
  end
end
