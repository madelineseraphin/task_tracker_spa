defmodule TaskTracker.Users.User do
  use Ecto.Schema
  import Ecto.Changeset

  schema "users" do
    field :admin, :boolean, default: false
    field :email, :string
    field :password_hash, :string
    has_many :tasks, TaskTracker.Tasks.Task

    timestamps()
  end

  @doc false
  def changeset(user, attrs) do
    user
    |> cast(attrs, [:email, :password_hash, :admin])
    |> validate_required([:email, :admin, :password_hash])
    |> validate_format(:email, ~r/@/)
    |> unique_constraint(:email)
  end
end
