<<<<<<< HEAD
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

=======
﻿FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src


>>>>>>> ce2e12c4d83e493cdc9090930d43c55ad3f92533
COPY ["OrzelKJ.csproj", "./"]
RUN dotnet restore "OrzelKJ.csproj"

COPY . .
RUN dotnet publish "OrzelKJ.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "OrzelKJ.dll"]