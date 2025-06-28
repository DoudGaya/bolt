import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Get in{' '}
            <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Touch
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Have questions about AI Marketing Assistant? We'd love to hear from you. 
            Send us a message and we'll respond as soon as possible.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Information */}
          <div className="lg:col-span-1">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start space-x-3">
                  <Mail className="h-5 w-5 text-purple-400 mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">support@aimarketingassistant.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-purple-400 mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Phone</p>
                    <p className="text-muted-foreground">+1 (555) 123-4567</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-purple-400 mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground">
                      123 AI Street<br />
                      Tech City, TC 12345<br />
                      United States
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-purple-400 mt-1" />
                  <div>
                    <p className="font-medium text-foreground">Business Hours</p>
                    <p className="text-muted-foreground">
                      Monday - Friday: 9:00 AM - 6:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="bg-card/50 backdrop-blur-sm border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Send us a Message</CardTitle>
              </CardHeader>
              <CardContent>
                <form className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input id="firstName" placeholder="John" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input id="lastName" placeholder="Doe" />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="john@example.com" />
                  </div>
                  
                  <div>
                    <Label htmlFor="company">Company (Optional)</Label>
                    <Input id="company" placeholder="Your Company" />
                  </div>
                  
                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <Input id="subject" placeholder="How can we help you?" />
                  </div>
                  
                  <div>
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us more about your inquiry..."
                      rows={6}
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">How does the AI content generation work?</h3>
                <p className="text-gray-600">
                  Our AI uses advanced machine learning models to generate professional marketing content 
                  based on your brand information and specific requirements.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Is there a free trial available?</h3>
                <p className="text-gray-600">
                  Yes! We offer a 14-day free trial with full access to all features so you can 
                  experience the power of AI-driven marketing content creation.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Can I customize the generated content?</h3>
                <p className="text-gray-600">
                  Absolutely! All generated content can be edited and customized to match your 
                  specific needs and brand voice.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">What file formats are supported?</h3>
                <p className="text-gray-600">
                  We support various formats including PNG, JPG, MP4, MP3, PDF, and more for 
                  different types of marketing content.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
