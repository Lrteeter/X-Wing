class Api::GamesController < ApplicationController
  def index
    @games = Game.all
    render :index
  end

  def create
    @game = Game.create!(game_params)
    render :index
  end

  def destroy
    @game = Game.find(params[:id])
    @game.destroy
    render :index
  end

  private

  def game_params
    params.require(:game).permit(:user1, :user2, :winner, :comments)
  end
end
