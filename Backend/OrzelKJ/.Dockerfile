FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

COPY ["OrzelKJ.csproj", "./"]
RUN dotnet restore "OrzelKJ.csproj"

COPY . .
RUN dotnet publish "OrzelKJ.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "OrzelKJ.dll"]
