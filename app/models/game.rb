class Game < ActiveRecord::Base
  belongs_to :user,
  primary_key: :id,
  foreign_key: :user1,
  class_name: "User"

  belongs_to :user,
  primary_key: :id,
  foreign_key: :user2,
  class_name: "User"
end
