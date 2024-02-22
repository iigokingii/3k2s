using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;


namespace lab1_4
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public MainWindow()
        {
            InitializeComponent();
        }

        private async void Button_Click(object sender, RoutedEventArgs e)
        {
            TextBox textBoxX = (TextBox)FindName("X");
            string valueX= "";
            if (textBoxX != null)
            {
                valueX = textBoxX.Text;
                
            }
            TextBox textBoxY = (TextBox)FindName("Y");
            string valueY = "";
            if (textBoxY != null)
            {
                valueY = textBoxY.Text;
            }
            using (HttpClient client = new HttpClient())
            {
               
                string json = JsonConvert.SerializeObject(new { X = valueX, Y = valueY });
                StringContent content = new StringContent(json, Encoding.UTF8, "application/json");
                HttpResponseMessage response = await client.PostAsync("http://localhost:5170/SUMMARY", content);

                Label label = (Label)FindName("Result");
                if (response.IsSuccessStatusCode)
                {
                    string responseData = await response.Content.ReadAsStringAsync();
                    string trimmedResponse = responseData.Trim('\"');
                    int result;
                    if (int.TryParse(trimmedResponse, out result))
                    {
                        TextBlock textBlock = (TextBlock)FindName("SUM");
                        textBlock.Text = trimmedResponse;
                        label.Content = "Успешно!";
                    }
                    else
                        label.Content = responseData;
                }
                else
                {
                    Console.WriteLine($"Ошибка: {response.StatusCode}");
                }

            }
        }
    }
}
