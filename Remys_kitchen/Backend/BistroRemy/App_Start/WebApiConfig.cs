﻿using Swashbuckle.Application;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Web.Http;
using System.Web.Http.Cors;

namespace BistroRemy
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            var cors = new EnableCorsAttribute("http://localhost:3000,http://127.0.0.1:3000", "*", "*"); //Eredeti --> Reacthez

            //var cors = new EnableCorsAttribute("http://127.0.0.1:5500", "*", "*");
            config.EnableCors(cors);
            // Web API routes
            config.MapHttpAttributeRoutes();

            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
            config.Routes.MapHttpRoute(
                name: "swagger",
                routeTemplate: "",
                defaults: null,
                constraints: null,
                handler: new RedirectHandler((url => url.RequestUri.ToString()), "swagger")
            );
            

          
        }

        
    }
}
