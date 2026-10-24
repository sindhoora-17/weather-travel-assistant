FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src
COPY WeatherTravelAssistant.Api.csproj ./
RUN dotnet restore
COPY . .
RUN dotnet publish WeatherTravelAssistant.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build /app/publish .
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 8080
ENTRYPOINT ["dotnet", "WeatherTravelAssistant.Api.dll"]
